"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import "@/styles/navbar.css";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [loggedEmail, setLoggedEmail] = useState<string | null>(null);

	useEffect(() => {
		try {
			const e = localStorage.getItem("nexus_forum_email");
			setLoggedEmail(e);
		} catch (err) {
			// ignore
		}

		function onStorage(ev: StorageEvent) {
			if (ev.key === "nexus_forum_email") setLoggedEmail(ev.newValue);
		}

		window.addEventListener("storage", onStorage);

		return () => window.removeEventListener("storage", onStorage);
	}, []);

	function handleLogout() {
		try {
			localStorage.removeItem("nexus_forum_email");
			setLoggedEmail(null);
			// reload to reset UI
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<header className="nx-navbar" role="banner">
			<div className="nx-container">
				<Link href="/" className="nx-brand" aria-label="NexusCTF Home">
					<div className="nx-logo">
						<Image src="/favicon.ico" alt="NexusCTF" width={28} height={28} />
					</div>
					<span className="nx-title">NexusCTF</span>
				</Link>

				<button
					className={`nx-burger ${isOpen ? "nx-burger-open" : ""}`}
					aria-label="Toggle navigation"
					aria-expanded={isOpen}
					onClick={() => setIsOpen((v) => !v)}
				>
					<span />
					<span />
					<span />
				</button>

				<nav className={`nx-nav ${isOpen ? "nx-nav-open" : ""}`} aria-label="Primary">
					<Link href="/forum" className="nx-link" onClick={() => setIsOpen(false)}>
						Forum
					</Link>
					<Link href="/terminal" className="nx-link" onClick={() => setIsOpen(false)}>
						Terminal
					</Link>
					{loggedEmail ? (
						<button className="nx-cta" onClick={handleLogout}>Logout</button>
					) : (
						<Link href="/api/auth/signin" className="nx-cta" onClick={() => setIsOpen(false)}>Sign In</Link>
					)}
				</nav>
			</div>
			<div className="nx-glow" aria-hidden="true" />
		</header>
	);
}
