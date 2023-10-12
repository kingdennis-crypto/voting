import Link from 'next/link'

export default function AdminPage() {
  return (
    <div>
      <p>Admin page</p>
      <Link href={'/admin/candidate'}>Candidates</Link>
      <br />
      <Link href={'/admin/party'}>Parties</Link>
    </div>
  )
}
