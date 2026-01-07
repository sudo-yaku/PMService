import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import taskrepo from './task.repo';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepoMock: Partial<taskrepo>;

  beforeEach(async () => {
    taskRepoMock = {
      pmSData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: taskrepo, useValue: taskRepoMock },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  it('should return transformed data when pmSData is successful', async () => {
    // Arrange
    const mockPmSData = {
      headerData: [
        { NUMTASKS: 10, NUMSTASKSDONE: 5 },
      ],
      pmtasks: [
        {
          TASKID: '1',
          TASKNAME: 'Battery Validation',
          STATUS: 'P',
          SPECIFICTASK: 'BATTERIES_JAR %', // Example kwname
          KWDESCRIPTION: 'Description for Battery Task'
        },
        {
          TASKID: '2',
          TASKNAME: 'Record 24v battery Voltage',
          STATUS: 'P',
          SPECIFICTASK: 'SITE_DC_PLANTLOAD_VOLTS_24',
          KWDESCRIPTION: 'Record DC Voltage readings for -24V systems'
        },
        {
          TASKID: '3',
          TASKNAME: 'Record 24v battery Amperage',
          STATUS: 'P',
          SPECIFICTASK: 'SITE_DC_PLANTLOAD_AMPS_24',
          KWDESCRIPTION: 'Record DC Amp readings for -24V systems'
        },
        {
          TASKID: '4',
          TASKNAME: 'Fuze Compliance Check',
          STATUS: 'P',
          SPECIFICTASK: 'SYS_FUZECOMPLIANCEVERIFICATION',
          KWDESCRIPTION: 'Verify compliance of fuse systems'
        },
        {
          TASKID: '5',
          TASKNAME: 'Generic Task',
          STATUS: 'P',
          SPECIFICTASK: '', // Test for empty kwname
          KWDESCRIPTION: 'Generic task description'
        },
      ],
    };

    (taskRepoMock.pmSData as jest.Mock).mockResolvedValue(mockPmSData);

    // Act
    const result = await taskService.PmData('somePmHeaderId');

    // Assert
    expect(taskRepoMock.pmSData).toHaveBeenCalledWith('somePmHeaderId');
    expect(result.headerData.numtasks).toBe(10);
   
    const firstTask = result.pmtasks[0];
    expect(firstTask.cfd_specific_task_definition).toEqual({
      kwvalues: "",
      kwcategory: "PM Specific Tasks",
      kwdatatype: "NUMBER",
      kwdecimalplaces: "2",
      kwdefaultvalue: "0.00",
      kwdescription: 'Description for Battery Task',
      kwname: 'BATTERIES_JAR %',
    });

    const secondTask = result.pmtasks[1];
    expect(secondTask.cfd_specific_task_definition).toEqual({
      kwvalues: "",
      kwcategory: "PM Specific Tasks",
      kwdatatype: "NUMBER",
      kwdecimalplaces: "2",
      kwdefaultvalue: "0.00",
      kwdescription: 'Record DC Voltage readings for -24V systems',
      kwname: 'SITE_DC_PLANTLOAD_VOLTS_24',
    });

    const emptyTask = result.pmtasks[4];
    expect(emptyTask.cfd_specific_task_definition).toEqual({});
  });

  it('should throw an error if pmSData fails', async () => {
    // Arrange
    const mockError = new Error('Database Error');
    (taskRepoMock.pmSData as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(taskService.PmData('somePmHeaderId')).rejects.toThrow(mockError);
    expect(taskRepoMock.pmSData).toHaveBeenCalledWith('somePmHeaderId');
  });
});