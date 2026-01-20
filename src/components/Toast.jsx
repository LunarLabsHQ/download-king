import { useToast } from '../context/ToastContext'

function Toast() {
  const { toast } = useToast()

  if (!toast) return null

  return (
    <div className={`toast active ${toast.type}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? '✓' : '✗'}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  )
}

export default Toast
