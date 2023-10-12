'use client'
import { useConfig } from '@/utils/context/config.context'
import RequestHelper from '@/utils/helpers/request'
import { RequestObject } from '@/utils/types'
import { useEffect, useState } from 'react'

// async function getOrganisations(): Promise<RequestObject> {
//   const res = await RequestHelper.makeRequest('/config/organisations', 'GET')
//   return res.data as RequestObject
// }

type Organisation = {
  organisation: string
  peers: string[]
}

export default function SettingsPage() {
  const {
    organisation: currentOrg,
    setOrganisation: setCurrentOrg,
    peer,
    setPeer,
  } = useConfig()

  const [availableOrgs, setAvailableOrgs] = useState<Organisation[]>()
  const [availablePeers, setAvailablePeers] = useState<string[]>()

  const [selectedOrg, setSelectedOrg] = useState<Organisation>()
  const [selectedPeer, setSelectedPeer] = useState<string>()

  useEffect(() => {
    const getData = async () => {
      const organisation = localStorage.getItem('organisation')!
      const peer = localStorage.getItem('peer')!

      const res = await RequestHelper.makeRequest<RequestObject>(
        '/config/organisations',
        'GET',
        { organisation, peer }
      )
      setAvailableOrgs(res.data.payload as Organisation[])
    }

    getData()
  }, [])

  useEffect(() => {
    if (!availableOrgs) return

    setAvailablePeers(
      availableOrgs.find(
        (org: Organisation) => org.organisation === currentOrg
      )!.peers
    )
  }, [availableOrgs, currentOrg])

  const handleOrgSave = () => {
    setCurrentOrg(selectedOrg!.organisation)
  }

  const handlePeerSave = () => {
    console.log(selectedPeer)
    setPeer(selectedPeer!)
  }

  return (
    <div>
      <p>Settings</p>
      <div className="flex flex-col gap-2 items-start">
        <div className="inline-flex flex-col">
          {availableOrgs ? (
            availableOrgs.map((organisation: Organisation, index: number) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedOrg(organisation)
                  setAvailablePeers(organisation.peers)
                }}
                className={`${
                  organisation.organisation === currentOrg
                    ? 'bg-green-400'
                    : 'bg-gray-200'
                }`}
              >
                {organisation.organisation}
              </button>
            ))
          ) : (
            <p>Loading...</p>
          )}

          <button className="bg-blue-600 text-white" onClick={handleOrgSave}>
            Save org choice
          </button>
        </div>
        <div className="inline-flex flex-col">
          {availablePeers ? (
            availablePeers.map((item: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedPeer(item)}
                className={`${
                  item === selectedPeer || item === peer
                    ? 'bg-green-400'
                    : 'bg-gray-200'
                }`}
              >
                {item}
              </button>
            ))
          ) : (
            <p>Please select an organisation</p>
          )}
          <button className="bg-blue-600 text-white" onClick={handlePeerSave}>
            Save peer choice
          </button>
        </div>
      </div>
    </div>
  )
}
