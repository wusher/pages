# Development

Contributing to Medusa or extending it for your needs? This guide covers the development workflow and testing practices.

## Setting Up for Development

Clone the repository and install in development mode:

```bash
git clone https://github.com/your-org/medusa.git
cd medusa
pip install -e ".[dev]"
```

The `-e` flag installs in editable mode, so changes take effect immediately without reinstalling.

## Running Tests

Medusa maintains 100% test coverage. Run the full suite with:

```bash
pytest
```

### Coverage Reports

Generate detailed coverage reports:

```bash
pytest --cov=medusa --cov-report=html
open htmlcov/index.html
```

### Running Specific Tests

Focus on particular areas during development:

```bash
# Run tests in a specific file
pytest tests/test_builder.py

# Run tests matching a pattern
pytest -k "test_page"

# Run with verbose output
pytest -v
```

## Code Quality

### Formatting

The codebase prioritizes readability with minimal dependencies. While no strict formatter is enforced, consistent style is appreciated.

### Type Hints

Python type hints are used throughout for documentation and IDE support. Keep them current when modifying function signatures.

## Project Structure

```
medusa/
  __init__.py       # Package entry point
  cli.py            # Command-line interface
  builder.py        # Site generation logic
  server.py         # Development server
  templates.py      # Jinja2 integration
  pages.py          # Page and collection models
tests/
  test_*.py         # Test modules
  fixtures/         # Test data and sample sites
```

## Making Changes

1. Create a feature branch from main
2. Write tests for new functionality
3. Implement your changes
4. Ensure all tests pass with full coverage
5. Submit a pull request with a clear description

## Common Development Tasks

### Adding a New Command

CLI commands live in `cli.py`. Use Click decorators to define new commands:

```python
@cli.command()
@click.argument('name')
def mycommand(name):
    """Description of what this command does."""
    pass
```

### Extending Page Metadata

Page properties are defined in `pages.py`. Add new fields to the Page dataclass and update the extraction logic.

### Adding Template Helpers

Custom Jinja2 globals and filters go in `templates.py`. Register them during environment setup.

## Debugging

Enable verbose logging during development:

```bash
medusa serve --debug
```

For template issues, Jinja2's debug extension can help trace rendering problems.
