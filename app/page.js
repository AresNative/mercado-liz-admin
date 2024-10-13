import Link from "next/link";
export default function Home() {
  return (
    <div className="p-6 min-h-screen bg-background text-text">
      <Link href="/Reports">Profile</Link>
      <Link href="/to-do">To Do</Link>
    </div>
  );
}
