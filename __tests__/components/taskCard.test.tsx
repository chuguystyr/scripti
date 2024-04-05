import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import TaskCard from 'components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  date: '2023-01-01',
  course: 'Test Course',
  status: 'new',
  description: 'Test Description',
};

vi.mock('server/actions/tasks', () => ({
  editTask: () => {},
  deleteTask: () => {},
  checkTask: () => {},
}));

describe('TaskCard component', () => {
  const mockSetEditable = vi.fn();
  const mockResetEditable = vi.fn();
  beforeEach(() => {
    cleanup();
    render(
      <TaskCard
        task={mockTask}
        setEditable={mockSetEditable}
        resetEditable={mockResetEditable}
      />
    );
  });

  it('should render task details', () => {
    expect(screen.getByText(mockTask.title)).toBeDefined();
    expect(screen.getByText(mockTask.date)).toBeDefined();
    expect(screen.getByText(mockTask.course)).toBeDefined();
    expect(screen.getByText(mockTask.status)).toBeDefined();
    expect(screen.getByText(mockTask.description)).toBeDefined();
  });

  it('should render three buttons', () => {
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });
});