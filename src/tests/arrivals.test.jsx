import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArrivalsPopup } from "../pages/Game";
import { arrivalsData } from "../data/ArrivalsData";
import "@testing-library/jest-dom";

describe("arrivals component", () => {
    it("should show the correct title for hour one on the popup when it is up", () => {
        const mockRenderHour = (round) => `Hour ${round}`;
        render(
            <ArrivalsPopup
                show={true}
                onHide={() => { }}
                round={1}
                renderHour={mockRenderHour}
            />
        );
        expect(screen.getByTestId("arrivals-title")).toHaveTextContent("Arrivals - Hour 1");
    });
})

describe("arrivals component", () => {
    it("should show the correct title for hour two on the popup when it is up", () => {
        const mockRenderHour = (round) => `Hour ${round}`;
        render(
            <ArrivalsPopup
                show={true}
                onHide={() => { }}
                round={2}
                renderHour={mockRenderHour}
            />
        );
        expect(screen.getByTestId("arrivals-title")).toHaveTextContent("Arrivals - Hour 2");
    });
})

describe("arrivals component", () => {
    it("should show the correct subtitle for the popup", () => {
        const mockRenderHour = (round) => `Hour ${round}`;
        render(
            <ArrivalsPopup
                show={true}
                onHide={() => { }}
                round={2}
                renderHour={mockRenderHour}
            />
        );
        expect(screen.getByTestId("arrivals-subtitle")).toHaveTextContent("New students or parents have arrived!");
    });
})