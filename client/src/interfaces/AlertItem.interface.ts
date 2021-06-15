enum AlertType {
  Error = 'error',
  Success = 'success'
}

interface AlertItem {
  title: string,
  content?: string,
  type: AlertType,
}

export { AlertType, AlertItem }
