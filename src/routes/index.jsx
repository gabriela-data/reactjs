import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../contexts/auth';
import Cadastro from '../pages/Cadastro';
import Configuracoes from '../pages/Configuracoes';
import Dashboard from '../pages/Dashboard';
import Formulario from '../pages/Formulario';
import ListagemUsuarios from '../pages/ListagemUsuarios';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Perfil from '../pages/Perfil';
import RecuperarSenha from '../pages/RecuperarSenha';

function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<ListagemUsuarios />} />
          <Route path="/usuarios/novo" element={<Formulario />} />
          <Route path="/usuarios/:id/editar" element={<Formulario />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
