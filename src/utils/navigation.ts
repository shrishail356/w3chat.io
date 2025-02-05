export const scrollToSection = (sectionId: string) => {
  // Remove the '#' if present
  const targetId = sectionId.replace("#", "");

  // Small delay to ensure smooth transition after page load
  setTimeout(() => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 100);
};

export const handleSectionNavigation = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  isCurrentPath: boolean
) => {
  e.preventDefault();

  if (!isCurrentPath) {
    // If not on home page, first navigate to home page
    window.location.href = "/" + href;
  } else {
    // If already on home page, just scroll to section
    scrollToSection(href);
  }
};
