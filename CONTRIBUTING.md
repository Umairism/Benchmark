# Contributing to Benchmark Club

We welcome contributions from the community! This guide will help you get started with contributing to the Benchmark Club project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Issue Guidelines](#issue-guidelines)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- Basic knowledge of React, TypeScript, and Supabase

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Benchmark.git
   cd Benchmark
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/Umairism/Benchmark.git
   ```

## 🛠️ Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🔄 Making Changes

### Branch Naming Convention

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Commit Message Format

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add social media authentication
fix(profile): resolve profile picture upload issue
docs(readme): update installation instructions
```

## 🔍 Pull Request Process

1. **Ensure your fork is up to date**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Documentation**: Update relevant documentation

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Define proper types for all props and state
- Use interfaces for object types
- Avoid `any` type unless absolutely necessary

### React

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and focused

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic color classes

### File Structure

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── index.ts
│   │   ├── ComponentName.tsx
│   │   └── ComponentName.test.tsx
├── hooks/
├── lib/
├── pages/
├── types/
└── utils/
```

### ESLint and Prettier

We use ESLint and Prettier for code formatting. Make sure to:

- Run `npm run lint` before committing
- Use the provided ESLint configuration
- Format code with Prettier

## 🐛 Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Browser, OS, device information
- **Screenshots**: Visual proof of the issue

### Feature Requests

For feature requests, please include:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: Your suggested implementation
- **Alternatives**: Other solutions you considered
- **Use Cases**: How would this be used?

### Labels

We use the following labels:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for components
- Use descriptive test names
- Test both success and error cases

## 📖 Documentation

### Types of Documentation

1. **Code Comments**: For complex logic
2. **Component Documentation**: Props, usage examples
3. **API Documentation**: Function signatures, parameters
4. **User Documentation**: How-to guides, tutorials

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

## 🏆 Recognition

Contributors will be recognized in:

- README contributors section
- Release notes
- Project documentation

## ❓ Questions?

If you have questions about contributing:

- Check existing issues and discussions
- Create a new discussion for general questions
- Create an issue for specific problems
- Contact the maintainers directly

## 📞 Contact

- **Main Maintainer**: Umair (@Umairism)
- **GitHub Discussions**: [Benchmark Discussions](https://github.com/Umairism/Benchmark/discussions)
- **Issues**: [GitHub Issues](https://github.com/Umairism/Benchmark/issues)

Thank you for contributing to Benchmark Club! 🎉
