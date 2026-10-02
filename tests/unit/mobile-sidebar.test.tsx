import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/layout/sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("Mobile Navigation & Auto-Close", () => {
  it("opens mobile drawer and automatically closes when Dashboard link is clicked", () => {
    const { container } = render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    expect(toggleButton).toBeDefined();
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");

    // Click to open mobile menu
    fireEvent.click(toggleButton);

    const closeButtons = screen.getAllByRole("button", { name: /fermer le menu/i });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
    expect(closeButtons[0].getAttribute("aria-expanded")).toBe("true");

    // Drawer should have translate-x-0 class
    const drawer = screen.getByRole("dialog", { name: /menu principal/i });
    expect(drawer.className).toContain("translate-x-0");

    // Find the Dashboard link inside the drawer
    const dashboardLinks = screen.getAllByRole("link", { name: /dashboard/i });
    // Click on the first link
    fireEvent.click(dashboardLinks[0]);

    // Drawer should now be closed (-translate-x-full) and button aria-expanded false
    expect(drawer.className).toContain("-translate-x-full");
    expect(screen.getByRole("button", { name: /ouvrir le menu/i }).getAttribute("aria-expanded")).toBe("false");
  });

  it("closes mobile drawer when clicking the close button", () => {
    render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    fireEvent.click(toggleButton);

    const closeButtons = screen.getAllByRole("button", { name: /fermer le menu/i });
    // Click the inner close button in the drawer header
    fireEvent.click(closeButtons[closeButtons.length - 1]);

    const drawer = screen.getByRole("dialog", { name: /menu principal/i });
    expect(drawer.className).toContain("-translate-x-full");
  });
});
