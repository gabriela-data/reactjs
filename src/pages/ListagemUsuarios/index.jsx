import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../contexts/auth';
import usePagination from '../../hooks/usePagination';
import useUsers from '../../hooks/useUsers';
import { getApiErrorMessage } from '../../services/errors';
import { notify } from '../../services/notification';

export default function ListagemUsuarios() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { page, pageSize, setPage, setPageSize } = usePagination();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { users, total, loading, error, refresh, deleteUser } = useUsers({
    page,
    pageSize,
    search,
  });

  useEffect(() => {
    if (error) {
      notify.error(
        getApiErrorMessage(error, 'Não foi possível carregar os usuários.')
      );
    }
  }, [error]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    const targetId = selectedUser.id ?? selectedUser._id;
    setIsDeleting(true);
    try {
      await deleteUser(targetId);
      notify.success('Usuário removido.');
      setSelectedUser(null);
      if (targetId && targetId === currentUser?.id) {
        logout();
        navigate('/login', { replace: true });
      }
    } catch (requestError) {
      notify.error(
        getApiErrorMessage(requestError, 'Não foi possível remover o usuário.')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      sortValue: (row) => row.nome ?? row.name ?? '',
      render: (_, row) => row.nome ?? row.name ?? '—',
    },
    { key: 'email', header: 'E-mail', sortable: true },
    {
      key: 'role',
      header: 'Perfil',
      sortable: true,
      sortValue: (row) =>
        row.role === 'admin' ? 'Administrador' : 'Usuário',
      render: (_, row) => {
        const isAdminRole = row.role === 'admin';
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isAdminRole
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isAdminRole ? 'Administrador' : 'Usuário'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      sortable: false,
      render: (_, row) => {
        const id = row.id ?? row._id;
        return (
          <div className="flex items-center gap-1">
            <Link
              to={`/usuarios/${id}/editar`}
              aria-label={`Editar ${row.nome ?? row.name ?? 'usuário'}`}
              className="rounded-lg p-2 text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Pencil aria-hidden="true" className="size-4" />
            </Link>
            <button
              type="button"
              aria-label={`Excluir ${row.nome ?? row.name ?? 'usuário'}`}
              onClick={() => setSelectedUser({ ...row, id })}
              className="rounded-lg p-2 text-danger hover:bg-danger/10 focus-visible:outline-2 focus-visible:outline-danger"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-1 text-sm text-gray-600">
            Consulte e gerencie os usuários da clínica.
          </p>
        </div>
        <Link
          to="/usuarios/novo"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus aria-hidden="true" className="size-4" />
          Novo usuário
        </Link>
      </header>
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            id="search-users"
            aria-label="Buscar usuários"
            placeholder="Buscar por nome, e-mail ou perfil"
            icon={Search}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full sm:max-w-sm"
          />
          {error && (
            <Button variant="secondary" onClick={refresh}>
              Tentar novamente
            </Button>
          )}
        </div>
        <DataTable
          columns={columns}
          data={users}
          rowKey={(row) => row.id ?? row._id ?? row.email}
          caption="Usuários cadastrados"
          loading={loading}
          emptyState={
            error
              ? 'Não foi possível carregar os usuários.'
              : 'Nenhum usuário encontrado.'
          }
        />
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          disabled={loading}
        />
      </Card>
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => !isDeleting && setSelectedUser(null)}
        title="Excluir usuário"
        description={`Deseja realmente excluir ${selectedUser?.nome ?? selectedUser?.name ?? 'este usuário'}? Esta ação não pode ser desfeita.`}
        footer={
          <>
            <Button
              variant="secondary"
              disabled={isDeleting}
              onClick={() => setSelectedUser(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={isDeleting}
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          O usuário será removido permanentemente do sistema.
        </p>
      </Modal>
    </div>
  );
}
