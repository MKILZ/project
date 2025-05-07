// src/tests/home.test.jsx
import React, { useState } from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Home from "../pages/Home";
import { AppContext } from "../context/useAppContext";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../supabase/supabaseClient";

// ——— Mocks —————————————————————————————————————————————————————
const mockNavigate = vi.fn();
const mockSetActiveUser = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

// default supabase mock: join-room success
vi.mock("../supabase/supabaseClient", () => ({
    supabase: {
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () =>
                        Promise.resolve({ data: { id: 1, lobby: "ABC123" }, error: null }),
                }),
            }),
        }),
    },
}));

// ——— Helper to render Home with real lobby state ————————————————————
function renderHome({ session = null } = {}) {
    function Wrapper({ children }) {
        const [lobby, setLobby] = useState("");
        return (
            <AppContext.Provider
                value={{ session, setActiveUser: mockSetActiveUser, lobby, setLobby }}
            >
                <BrowserRouter>{children}</BrowserRouter>
            </AppContext.Provider>
        );
    }
    return render(<Home />, { wrapper: Wrapper });
}

describe("Home.jsx", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders heading and the Login button when no session", () => {
        renderHome();
        expect(
            screen.getByRole("heading", { level: 1 })
        ).toHaveTextContent("Interview day @ Kauffman");
        expect(
            screen.getByRole("button", { name: /login as a host/i })
        ).toBeInTheDocument();
    });

    it("opens AuthModal on 'Login as a Host' click", () => {
        renderHome();
        fireEvent.click(screen.getByRole("button", { name: /login as a host/i }));
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("joins an existing room successfully", async () => {
        renderHome();
        const nameInput = screen.getByPlaceholderText(/enter your name/i);
        const codeInput = screen.getByPlaceholderText(/enter the room code/i);
        const joinBtn = screen.getByRole("button", { name: /join room/i });

        fireEvent.change(nameInput, { target: { value: "tester" } });
        fireEvent.change(codeInput, { target: { value: "ABC123" } });

        await waitFor(() => expect(joinBtn).toBeEnabled());
        fireEvent.click(joinBtn);

        await waitFor(() =>
            expect(mockSetActiveUser).toHaveBeenCalledWith({
                role: "Player",
                userName: "tester",
            })
        );
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/lobby/ABC123")
        );
    });

    it("shows an error toast when the room doesn't exist", async () => {
        // override supabase.from → no data
        vi.spyOn(supabase, "from").mockImplementation(() => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: {} }),
                }),
            }),
        }));
        const toastSpy = vi.spyOn(Swal, "fire").mockResolvedValue({});

        renderHome();
        fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
            target: { value: "u" },
        });
        fireEvent.change(screen.getByPlaceholderText(/enter the room code/i), {
            target: { value: "ZZZZZZ" },
        });
        const joinBtn = screen.getByRole("button", { name: /join room/i });

        await waitFor(() => expect(joinBtn).toBeEnabled());
        fireEvent.click(joinBtn);

        await waitFor(() =>
            expect(toastSpy).toHaveBeenCalledWith({
                title: "Lobby doesn't exist!",
                icon: "error",
                confirmButtonText: "Oh my bad",
            })
        );
    });

    it("shows 'Host Game' when session exists", () => {
        renderHome({ session: { user: { id: "u1" } } });
        expect(
            screen.getByRole("button", { name: /host game/i })
        ).toBeInTheDocument();
    });
});