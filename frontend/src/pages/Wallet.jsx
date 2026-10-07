import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, getSession } from "../api.js";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";
import Notice from "../components/Notice.jsx";

const money = (value) => Number(value || 0).toFixed(2);

const label = (value) =>
    String(value || "OTHER").replaceAll("_", " ");

export default function Wallet() {
    const session = getSession();

    const [wallet, setWallet] = useState(null);
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!session?.userId) {
            return;
        }

        loadWalletData();
    }, []);

    async function loadWalletData() {
        if (!session?.userId) {
            setMessage("Please login again.");
            return;
        }

        setMessage("");

        // Load wallet independently
        try {
            const walletData = await api.wallet(session.userId);
            setWallet(walletData);
        } catch (error) {
            console.error("Wallet loading error:", error);
            setMessage("Unable to load wallet balance.");
        }

        // Load student profile independently
        try {
            const profileData = await api.student(session.userId);
            setProfile(profileData);
        } catch (error) {
            console.warn("Student profile not available:", error);
            setProfile(null);
        }

        // Load transactions independently
        try {
            const transactionData =
                await api.transactions(session.userId);

            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );
        } catch (error) {
            console.warn("Transaction loading error:", error);
            setTransactions([]);
        }
    }

    const spent = useMemo(() => {
        return transactions
            .filter((item) => item.type === "SEND")
            .reduce(
                (total, item) =>
                    total + Number(item.amount || 0),
                0
            );
    }, [transactions]);

    const categories = useMemo(() => {
        return transactions
            .filter((item) => item.type === "SEND")
            .reduce((result, item) => {
                const category = item.category || "OTHER";

                result[category] =
                    (result[category] || 0) +
                    Number(item.amount || 0);

                return result;
            }, {});
    }, [transactions]);

    async function addDemoMoney() {
        if (!session?.userId) {
            setMessage("Please login again.");
            return;
        }

        setBusy(true);
        setMessage("");

        try {
            await api.addMoney(session.userId, 100);

            // Reload wallet after adding money
            const updatedWallet =
                await api.wallet(session.userId);

            setWallet(updatedWallet);

            // Reload transactions
            try {
                const updatedTransactions =
                    await api.transactions(session.userId);

                setTransactions(
                    Array.isArray(updatedTransactions)
                        ? updatedTransactions
                        : []
                );
            } catch (error) {
                console.warn(
                    "Could not refresh transactions:",
                    error
                );
            }

            setMessage("Demo funds added: 100");
        } catch (error) {
            console.error("Add money error:", error);
            setMessage(
                error.message || "Unable to add demo money."
            );
        } finally {
            setBusy(false);
        }
    }

    if (!session?.userId) {
        return (
            <Layout
                title="Student Wallet"
                subtitle="Please login to access your wallet."
            >
                <Notice
                    message="Please login to continue."
                    type="error"
                />

                <Link
                    to="/login"
                    className="primary-button"
                >
                    Go to Login
                </Link>
            </Layout>
        );
    }

    return (
        <Layout
            title={`Hello, ${session.name}`}
            subtitle="Your student wallet at a glance."
        >
            {message && (
                <Notice
                    message={message}
                    type="success"
                />
            )}

            {/* BACKEND STATUS */}
            <div className="backend-status">
                <span className="status-dot"></span>
                Backend: localhost:8080
            </div>

            {/* WALLET + STUDENT PROFILE */}
            <section className="hero-grid">

                {/* WALLET */}
                <div className="balance-card">

                    <div>
                        <span>AVAILABLE BALANCE</span>

                        <strong>
                            {wallet
                                ? money(wallet.balance)
                                : "0.00"}
                        </strong>

                        <small>
                            Demo wallet balance
                        </small>
                    </div>

                    <div className="wallet-address">
                        {wallet?.address ||
                            "Wallet address unavailable"}
                    </div>
                </div>

                {/* STUDENT PROFILE */}
                <div className="profile-card">

                    <div className="profile-title">

                        <span className="avatar big">
                            {session.name
                                ?.slice(0, 1)
                                .toUpperCase()}
                        </span>

                        <div>
                            <h3>{session.name}</h3>

                            <p>
                                {profile?.studentId ||
                                    "Student ID not available"}
                            </p>
                        </div>

                    </div>

                    <div className="profile-lines">

                        <span>
                            <b>Department</b>
                            {profile?.department || "—"}
                        </span>

                        <span>
                            <b>Year</b>
                            {profile?.year || "—"}
                        </span>

                        <span>
                            <b>College</b>
                            {profile?.college || "—"}
                        </span>

                    </div>

                </div>

            </section>

            {/* STATISTICS */}
            <div className="stats-grid">

                <StatCard
                    label="Total spent"
                    value={money(spent)}
                    icon="↗"
                />

                <StatCard
                    label="Transactions"
                    value={transactions.length}
                    icon="↔"
                />

                <StatCard
                    label="Food"
                    value={money(categories.CANTEEN)}
                    icon="🍔"
                />

                <StatCard
                    label="Transport"
                    value={money(categories.TRANSPORT)}
                    icon="🚌"
                />

            </div>

            {/* QUICK ACTIONS */}
            <section className="section-head">

                <div>
                    <h2>Quick actions</h2>

                    <p>
                        Make a campus payment or manage your wallet.
                    </p>
                </div>

            </section>

            <div className="action-grid">

                <Link
                    to="/send"
                    className="action-card"
                >
                    <b>Send payment</b>
                    <span>
                        Pay another student or campus wallet →
                    </span>
                </Link>

                <Link
                    to="/receive"
                    className="action-card"
                >
                    <b>Receive</b>
                    <span>
                        Show your wallet address and QR →
                    </span>
                </Link>

                <Link
                    to="/pay"
                    className="action-card"
                >
                    <b>QR Pay</b>
                    <span>
                        Create or scan a campus payment QR →
                    </span>
                </Link>

                <Link
                    to="/merchant"
                    className="action-card"
                >
                    <b>Merchant</b>
                    <span>
                        View received campus payments →
                    </span>
                </Link>

                <button
                    className="action-card"
                    onClick={addDemoMoney}
                    disabled={busy}
                >
                    <b>
                        {busy
                            ? "Adding..."
                            : "Add demo money"}
                    </b>

                    <span>
                        Add 100 to test the wallet.
                    </span>
                </button>

            </div>

            {/* TRANSACTIONS */}
            <section className="section-head">

                <div>
                    <h2>Recent transactions</h2>

                    <p>
                        Latest activity on your wallet.
                    </p>
                </div>

                <Link
                    to="/history"
                    className="text-link"
                >
                    View all →
                </Link>

            </section>

            <div className="table-card">
                <TransactionTable
                    transactions={transactions.slice(0, 5)}
                />
            </div>

        </Layout>
    );
}

function TransactionTable({ transactions }) {

    if (!transactions.length) {
        return (
            <div className="empty">
                No transactions yet.
            </div>
        );
    }

    return (
        <div className="table-wrap">

            <table>

                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>

                    {transactions.map((item) => (

                        <tr key={item.id}>

                            <td>
                                <span
                                    className={`badge ${
                                        item.type?.toLowerCase() ||
                                        "receive"
                                    }`}
                                >
                                    {item.type}
                                </span>
                            </td>

                            <td>
                                {label(item.category)}
                            </td>

                            <td
                                className={
                                    item.type === "SEND"
                                        ? "negative"
                                        : "positive"
                                }
                            >
                                {item.type === "SEND"
                                    ? "-"
                                    : "+"}
                                {money(item.amount)}
                            </td>

                            <td>
                                {item.note || "—"}
                            </td>

                            <td>
                                {item.date
                                    ? new Date(
                                          item.date
                                      ).toLocaleString()
                                    : "—"}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}