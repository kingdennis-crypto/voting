'use client'

import { useEffect, useState } from 'react'
import AdminSection from './section'
import axios from 'axios'

// Inspiration
// https://dribbble.com/shots/21751238-Asset-Group-Setup-1-3

type IChannelObj = {
  name: string
  organisation: {
    name: string
    peers: string[]
  }[]
}

type ISelectedConfig = {
  name: string
  organisation: {
    name: string
    peer: string
  }
}

type Organisation = {
  id: string
  peers: string[]
}

type Selected = { user: string; channel: string }

export default function AdminPage() {
  const [identities, setIdentities] = useState<string[]>([])
  const [channels, setChannels] = useState<string[]>([])

  const [selectedChannel, setSelectedChannel] = useState<string>()
  const [selectedUser, setSelectedUser] = useState<string>()

  useEffect(() => {
    axios
      .get('http://localhost:5050/config/identities')
      .then((res: any) => {
        setIdentities(res.data.payload)
        setSelectedUser(res.data.payload[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:5050/config/connection')
      .then((res: any) => {
        setChannels(res.data.payload.channels)
        setSelectedChannel(res.data.payload.channels[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleSave = () => {
    axios
      .post('http://localhost:5050/config/connection', {
        channel: selectedChannel,
        user: selectedUser,
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <AdminSection
        label="User"
        description="Which user you will call the network with"
      >
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {identities.map((item: string, index: number) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </AdminSection>
      <hr className="my-4" />
      <AdminSection
        label="Channel"
        description="Select the channel to communicate in"
      >
        <select
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {channels.map((item: string, index: number) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </AdminSection>
      <hr className="my-4" />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white rounded-md px-6 py-2"
      >
        Save
      </button>
    </div>
  )

  // return (
  //     <AdminSection
  //       label="Channel"
  //       description="Select the channel to communicate in"
  //     >
  //       <ul className="text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden">
  //         <li className="w-full px-4 py-2 border-b last:border-b-0 border-gray-200 inline-flex justify-between items-center">
  //           <p className="w-1/3">Channel</p>
  //           <select
  //             onChange={(e) => updateItem('name', e.target.value)}
  //             className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           >
  //             {channelConfig.map((item: IChannelObj, index: number) => (
  //               <option key={index} value={item.name}>
  //                 {item.name}
  //               </option>
  //             ))}
  //           </select>
  //         </li>
  //         <li className="w-full px-4 py-2 border-b last:border-b-0 border-gray-200 inline-flex justify-between items-center">
  //           <p className="w-1/3">Organisation</p>
  //           <select
  //             onChange={(e) =>
  //               updateItem('organisation', {
  //                 name: e.target.value,
  //                 peer: channelConfig
  //                   .find((e) => e.name === selectedConfig!.name)!
  //                   .organisation.find((org) => org.name === e.target.value)!
  //                   .peers[0],
  //               })
  //             }
  //             className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           >
  //             {channelConfig
  //               .find((e) => e.name === selectedConfig?.name)
  //               ?.organisation.map((item, index: number) => (
  //                 <option key={index} value={item.name}>
  //                   {item.name}
  //                 </option>
  //               ))}
  //           </select>
  //         </li>
  //         <li className="w-full px-4 py-2 border-b last:border-b-0 border-gray-200 inline-flex justify-between items-center">
  //           <p className="w-1/3">Peer</p>
  //           <select
  //             onChange={(e) =>
  //               updateItem('organisation', {
  //                 name: selectedConfig!.organisation.name,
  //                 peer: e.target.value,
  //               })
  //             }
  //             className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  //           >
  //             {channelConfig
  //               .find((e) => e.name === selectedConfig!.name)!
  //               .organisation.find(
  //                 (e) => e.name === selectedConfig!.organisation.name
  //               )!
  //               .peers.map((item, index: number) => (
  //                 <option key={index} value={item}>
  //                   {item}
  //                 </option>
  //               ))}
  //           </select>
  //         </li>
  //       </ul>
  //     </AdminSection>
  //     <hr className="my-4" />
  //     <button className="bg-blue-600 text-white rounded-md py-2 px-4">
  //       Save
  //     </button>
  //   </div>
  // )
}
