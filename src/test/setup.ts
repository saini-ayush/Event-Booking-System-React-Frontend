import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("date-fns", () => ({
  format: vi.fn().mockImplementation(() => "Mocked Date"),
}));
