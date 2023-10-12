'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'

interface ConfigInterface {
  organisation: string
  setOrganisation: Dispatch<SetStateAction<string>>
  peer: string
  setPeer: Dispatch<SetStateAction<string>>
}

const ConfigContext = createContext<ConfigInterface>({
  organisation: '',
  setOrganisation: () => {},
  peer: '',
  setPeer: () => {},
})

type Props = { children: ReactNode }

export function ConfigProvider({ children }: Props): ReactNode {
  const [organisation, setOrganisation] = useState<string>('')
  const [peer, setPeer] = useState<string>('')

  useEffect(() => {
    if (organisation === '') {
      setOrganisation(localStorage.getItem('organisation') || '')
      return
    }

    localStorage.setItem('organisation', organisation)
  }, [organisation])

  useEffect(() => {
    if (peer === '') {
      setPeer(localStorage.getItem('peer') || '')
      return
    }

    localStorage.setItem('peer', peer)
  }, [peer])

  return (
    <ConfigContext.Provider
      value={{ organisation, setOrganisation, peer, setPeer }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigInterface {
  return useContext(ConfigContext)
}
