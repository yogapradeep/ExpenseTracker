import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
      <p>This is landing Page</p>
      <Link href="/expenses">
        <button className="text-white rounded-1 px-4 py-3  fs-6 flex-grow-1 custom-btn-primary ">
          Go to Application
        </button>
      </Link>
    </div>
  );
}
