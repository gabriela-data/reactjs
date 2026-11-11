import toast from 'react-hot-toast';

const durations = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
};

function withDuration(type, options) {
  return {
    duration: durations[type],
    ...options,
  };
}

export const notify = {
  success(message, options) {
    return toast.success(message, withDuration('success', options));
  },

  error(message, options) {
    return toast.error(message, withDuration('error', options));
  },

  warning(message, options) {
    return toast(message, {
      icon: '⚠️',
      ...withDuration('warning', options),
    });
  },

  info(message, options) {
    return toast(message, {
      icon: 'ℹ️',
      ...withDuration('info', options),
    });
  },

  dismiss(toastId) {
    toast.dismiss(toastId);
  },
};
