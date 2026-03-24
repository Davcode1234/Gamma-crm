import {
  getAllStudioTasks,
  StudioTaskTypes,
  UpdateStudioTask,
} from './services/studio-tasks-service';

export const statuses: StudioTaskTypes['status'][] = [
  'do_wzięcia',
  'na_później',
  'do_zrobienia',
  'w_trakcie',
  'wysłane',
];

export const statusNames: Record<StudioTaskTypes['status'], string> = {
  do_wzięcia: 'Do wzięcia',
  na_później: 'Na później',
  do_zrobienia: 'Do zrobienia',
  w_trakcie: 'W trakcie',
  wysłane: 'Wysłane',
};

export type TasksByStatus = Record<
  StudioTaskTypes['status'],
  StudioTaskTypes[]
>;

export const getTasksByStatus = (unorderedTasks: StudioTaskTypes[]) => {
  const tasksByStatus: TasksByStatus = unorderedTasks.reduce(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    statuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {} as TasksByStatus
    )
  );
  statuses.forEach((status) => {
    tasksByStatus[status] = tasksByStatus[status].sort(
      (recordA: StudioTaskTypes, recordB: StudioTaskTypes) =>
        recordA.index - recordB.index
    );
  });
  return tasksByStatus;
};

export const updateTaskStatus = async (source, destination) => {
  const studioTasks = await getAllStudioTasks();

  const tasksByStatus = getTasksByStatus(studioTasks);
  console.log('source:', source, 'destination:', destination);

  // inside same column
  if (source.status === destination.status) {
    const columnTasks = tasksByStatus[source.status];
    const destinationIndex = destination.index
      ? destination.index
      : columnTasks.length + 1;

    // Try if columnTasks[0] > 1 increse by +2

    if (source.index > destination.index) {
      console.log('moved up');

      await UpdateStudioTask({
        id: destination._id,
        studioTaskData: { index: destinationIndex + 1 },
      });
      await UpdateStudioTask({
        id: source._id,
        studioTaskData: { index: destinationIndex },
      });
      console.log(
        'FILTERED',
        columnTasks.filter(
          (task) => task.index >= destinationIndex && task.index < source.index
        )
      );

      await Promise.all(
        columnTasks
          .filter(
            (task) =>
              task.index >= destinationIndex && task.index < source.index
          )
          .map(async (underTask) => {
            console.log(underTask.title, 'Added +1 to index');
            return UpdateStudioTask({
              id: underTask._id,
              studioTaskData: { index: underTask.index + 1 },
            });
          })
      );

      return;
    }
    console.log('moved down');
    await UpdateStudioTask({
      id: destination._id,
      studioTaskData: { index: destination.index - 1 },
    });
    await UpdateStudioTask({
      id: source._id,
      studioTaskData: { index: destination.index },
    });

    await Promise.all(
      columnTasks
        .filter(
          (task) => task.index <= destinationIndex && task.index > source.index
        )
        .map(async (underTask) => {
          console.log(underTask.title, ' -1 to index');
          return UpdateStudioTask({
            id: underTask._id,
            studioTaskData: { index: underTask.index - 1 },
          });
        })
    );

    return;
  }

  // moving task across columns
  const sourceColumn = tasksByStatus[source.status];
  const destinationColumn = tasksByStatus[destination.status];
  // const destinationIndex = destination.index ?? destinationColumn.length + 1;

  let destinationIndex;

  if (!destination.index && destinationColumn.length === 0) {
    destinationIndex = destinationColumn.length + 1;
  }

  if (!destination.index && destinationColumn.length > 0) {
    destinationIndex =
      destinationColumn[destinationColumn.length - 1].index + 1;
  }

  if (destination.index) {
    destinationIndex = destination.index;
  }

  await Promise.all([
    ...sourceColumn
      .filter((task) => task.index > source.index)
      .map(async (task) =>
        UpdateStudioTask({
          id: task._id,
          studioTaskData: { index: task.index - 1 },
        })
      ),

    ...destinationColumn
      .filter((task) => task.index >= destinationIndex)
      .map(async (task) =>
        UpdateStudioTask({
          id: task._id,
          studioTaskData: { index: task.index + 1 },
        })
      ),

    await UpdateStudioTask({
      id: source._id,
      studioTaskData: { index: destinationIndex, status: destination.status },
    }),
  ]);
};

export const updateTaskStatusLocal = (
  sourceTask: StudioTaskTypes,
  source: { status: StudioTaskTypes['status']; index: number },
  destination: {
    status: StudioTaskTypes['status'];
    index?: number;
  },
  tasksByStatus: TasksByStatus
) => {
  if (!destination) return tasksByStatus;

  if (source.status === destination.status) {
    // Copy the source column to avoid mutating the original
    const column = [...tasksByStatus[source.status]];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length, 0, sourceTask);

    return {
      ...tasksByStatus,
      [destination.status]: column,
    };
  } else {
    // Copy both source and destination columns
    const sourceColumn = [...tasksByStatus[source.status]];
    const destinationColumn = [...tasksByStatus[destination.status]];

    // if (destinationColumn[0].index === 1) {
    //   const updatedDestinationColumn = destinationColumn.map((columnTask) => {
    //     return { ...columnTask, index: columnTask.index - 1 };
    //   });
    //   console.log('łeeeee', updatedDestinationColumn);
    // }

    // Remove the task from the source column
    sourceColumn.splice(source.index, 1);

    // Add the task to the destination column
    destinationColumn.splice(
      destination.index ?? destinationColumn.length,
      0,
      sourceTask
    );

    return {
      ...tasksByStatus,
      [source.status]: sourceColumn,
      [destination.status]: destinationColumn,
    };
  }
};
