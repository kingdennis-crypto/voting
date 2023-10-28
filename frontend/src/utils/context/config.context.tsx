'use client'

import axios from 'axios'
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'

interface ConfigInterface {
  isInitialised: boolean
}

const ConfigContext = createContext<ConfigInterface>({ isInitialised: false })

type Props = { children: ReactNode }

export function ConfigProvider({ children }: Props): ReactNode {
  const [isInitialised, setInitialised] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/config/initialized`)
      .then((res) => {
        console.log(res.data.payload)
        setInitialised(res.data.payload.initialised)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <ConfigContext.Provider value={{ isInitialised }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigInterface {
  return useContext(ConfigContext)
}
