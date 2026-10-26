# Contributing to FestFlow

Thank you for your interest in contributing to **FestFlow**! We welcome contributions to make the campus festival and event experience better for everyone.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/rahulguttedar03-debug/festflow.git
   cd festflow
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Start development**:
   ```bash
   npm run dev
   ```

## Development Guidelines

- **TypeScript**: Ensure strict type checking passes (`npm run build`).
- **Styling**: Use Tailwind CSS utility classes following the existing design system.
- **Components**: Place reusable UI components in `src/components/` and page views in `src/pages/`.
- **Commit Messages**: Write concise, descriptive commit messages adhering to Conventional Commits (e.g. `feat: ...`, `fix: ...`, `docs: ...`).

## Pull Request Process

1. Test your changes thoroughly locally.
2. Ensure `npm run build` succeeds with zero errors.
3. Push to your branch and open a Pull Request against `main`.
4. Provide a clear description of the feature or bug fix.
