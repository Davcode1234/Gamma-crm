import { useEffect, useState } from 'react';
import {
  ClientsType,
  getGraphicsPerClientSummary,
} from '../services/clients-service';
import {
  CompaniesType,
  getAssignedReckoTasks,
} from '../services/companies-service';

const useClientStats = (
  currentMonthIndex: number,
  selectedYear: number,
  selectedMonth: string,
  client: ClientsType,
  companies: CompaniesType[],
  initialCompanyObject: CompaniesType
) => {
  const [chartData, setChartData] = useState([]);
  const [tasksLength, setTasksLength] = useState(0);
  const [currentCompany, setCurrentCompany] =
    useState<CompaniesType>(initialCompanyObject);

  useEffect(() => {
    const getSummary = async () => {
      try {
        const response = await getGraphicsPerClientSummary(
          currentMonthIndex + 1,
          selectedYear,
          client.name
        );
        if (response) {
          const filteredClientParticipants = response.map((cl) => {
            return {
              ...cl,
              participants: cl.participants.filter((part) => part.hours > 0),
            };
          });
          setChartData(filteredClientParticipants);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (client?.name) {
      getSummary();
    }
  }, [client, selectedYear, selectedMonth]);

  useEffect(() => {
    if (client && companies.length > 0) {
      const company = companies.find((com) => com.name === client.company);
      if (company) {
        setCurrentCompany(company);
        getAssignedReckoTasks({
          company: company.name,
          monthIndex: currentMonthIndex + 1,
          yearIndex: selectedYear,
        }).then((reckoTasks) => {
          if (reckoTasks.reckoTasks.length > 0) {
            const filteredRecko = reckoTasks.reckoTasks.filter((rt) => {
              return rt.clientPerson === client.name;
            });

            setTasksLength(filteredRecko.length);
          }
        });
      } else {
        console.warn(`Company "${client.company}" not found.`);
      }
    }
  }, [client, companies, selectedMonth, selectedYear, currentMonthIndex]);

  return { chartData, tasksLength, currentCompany };
};

export default useClientStats;
