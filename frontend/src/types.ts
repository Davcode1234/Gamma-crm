import { StudioTaskTypes } from './services/studio-tasks-service';

export type Id = string | number;

export type Column = {
  class: string;
  title: string;
  id: Id;
};

export type ColumnComp = {
  col: Column;
  tasks: StudioTaskTypes[];
};
