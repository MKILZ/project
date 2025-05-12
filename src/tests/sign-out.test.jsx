import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SettingsModal } from "../pages/Home";
import { AppContext } from "../context/useAppContext";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { supabase } from "../supabase/supabaseClient";

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
        auth: {
            signOut: vi.fn(),  // Mock the signOut function
        },
    })),
}));

describe("sign out button", () => {
    it("should disable when a user is signed out", () => {
        render(
            <AppContext.Provider value={{ session: null, setSession: () => { } }}>
                <SettingsModal show={true} onHide={() => { }} />
            </AppContext.Provider>
        );

        const signOutButton = screen.getByRole("button", { name: /sign out/i });
        expect(signOutButton).toBeDisabled();
    });
});

describe("sign out button", () => {
    it("should be enabled when a user is signed in", () => {
        render(
            <AppContext.Provider value={{ session: { user: "mockUser" }, setSession: () => { } }}>
                <SettingsModal show={true} onHide={() => { }} />
            </AppContext.Provider>
        );

        const signOutButton = screen.getByRole("button", { name: /sign out/i });
        expect(signOutButton).toBeEnabled();
    });
});

describe("sign out button", () => {
    it("should sign user out when a user is signed in and clicks it", () => {
        const mockSetSettion = vi.fn();

        render(
            <AppContext.Provider value={{ session: { user: "mockUser" }, setSession: mockSetSettion }}>
                <SettingsModal show={true} onHide={() => { }} />
            </AppContext.Provider>
        );

        const signOutButton = screen.getByRole("button", { name: /sign out/i });
        fireEvent.click(signOutButton)
        expect(supabase.auth.signOut).toHaveBeenCalled();
    });
});

