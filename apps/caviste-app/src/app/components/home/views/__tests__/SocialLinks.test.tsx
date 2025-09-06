import { render, screen } from "@testing-library/react";
import SocialLinks from "../SocialLinks";

jest.mock("@pkg/design-system", () => ({
  InstagramIcon: () => <div data-testid="instagram-icon">Instagram</div>,
  FacebookIcon: () => <div data-testid="facebook-icon">Facebook</div>,
}));

describe("SocialLinks", () => {
  it("renders Instagram and Facebook links", () => {
    render(<SocialLinks />);

    const instagramLink = screen.getByLabelText("Suivez-nous sur Instagram");
    const facebookLink = screen.getByLabelText("Suivez-nous sur Facebook");

    expect(instagramLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
  });

  it("has correct href attributes", () => {
    render(<SocialLinks />);

    const instagramLink = screen.getByLabelText("Suivez-nous sur Instagram");
    const facebookLink = screen.getByLabelText("Suivez-nous sur Facebook");

    expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/edouard_cavistepersonnel/",
    );
    expect(facebookLink).toHaveAttribute(
      "href",
      "https://www.facebook.com/Edouard.Caviste.Personnel",
    );
  });

  it("opens links in new tab", () => {
    render(<SocialLinks />);

    const instagramLink = screen.getByLabelText("Suivez-nous sur Instagram");
    const facebookLink = screen.getByLabelText("Suivez-nous sur Facebook");

    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(facebookLink).toHaveAttribute("target", "_blank");
    expect(facebookLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has correct positioning classes", () => {
    render(<SocialLinks />);

    const container = screen
      .getByLabelText("Suivez-nous sur Instagram")
      .closest("div");
    expect(container).toHaveClass(
      "fixed",
      "left-6",
      "flex",
      "flex-col",
      "space-y-4",
      "z-card",
      "bottom-4",
      "md:top-4",
      "md:bottom-auto",
      "m-0",
      "p-0",
    );
  });
});
