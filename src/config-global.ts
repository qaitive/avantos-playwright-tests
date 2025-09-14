import packageJson from '../package.json'

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string
  appVersion: string
  serverUrl: string
}

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Avantos',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
}
