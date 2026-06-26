import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

// Tauri bindings are mocked globally in src/test/setup.ts

describe('App', () => {
  it('renders main window layout', () => {
    render(<App />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /simplified two-column workspace/i,
      })
    ).toBeInTheDocument()
  })

  it('switches the left column content when clicking the navigation tabs', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('tab', { name: /appearance/i }))

    expect(
      screen.getByRole('heading', { name: /appearance controls/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /theme and presentation controls/i,
      })
    ).toBeInTheDocument()
  })

  it('renders title bar with traffic light buttons', () => {
    render(<App />)
    // Find specifically the window control buttons in the title bar
    const titleBarButtons = screen
      .getAllByRole('button')
      .filter(
        button =>
          button.getAttribute('aria-label')?.includes('window') ||
          button.className.includes('window-control')
      )
    // Should have at least the window control buttons
    expect(titleBarButtons.length).toBeGreaterThan(0)
  })
})
