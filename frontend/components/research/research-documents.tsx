"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

// Mock research documents data
const researchDocumentsData = [
  {
    research_code: "RES001",
    research_year: 2020,
    title: "Climate Change Impact on Rainfall Patterns in Kagera Basin",
    description: "Comprehensive analysis of rainfall variability and trends in the Kagera Basin from 1970-2020",
    lead_researcher: "Dr. John Mwandosya",
    research_team: "Dr. Mary Kimani, Prof. Peter Msolla, Dr. Sarah Mwalimu",
    submission_to: "Tanzania Journal of Climate Science",
    date_started: "2019-01-15",
    date_finished: "2020-12-20",
    date_created: "2019-01-15T10:00:00Z",
    created_by: "Dr. John Mwandosya",
    related_data: [
      { climate_scenario: "OBSERVED", data_type: "RAINFALL", date_from: "1970-01-01", date_to: "2020-12-31" },
      { climate_scenario: "SSP245", data_type: "RAINFALL", date_from: "2021-01-01", date_to: "2050-12-31" },
    ],
  },
  {
    research_code: "RES002",
    research_year: 2021,
    title: "Temperature Trends and Agricultural Productivity in East Africa",
    description: "Study on the relationship between temperature changes and crop yields in the region",
    lead_researcher: "Prof. Grace Mbwambo",
    research_team: "Dr. James Kilimo, Dr. Agnes Mwakasege, Mr. Robert Mushi",
    submission_to: "African Agricultural Research Journal",
    date_started: "2020-03-01",
    date_finished: "2021-11-30",
    date_created: "2020-03-01T09:00:00Z",
    created_by: "Prof. Grace Mbwambo",
    related_data: [
      { climate_scenario: "OBSERVED", data_type: "TEMPERATURE", date_from: "1973-01-01", date_to: "2021-12-31" },
      { climate_scenario: "SSP126", data_type: "TEMPERATURE", date_from: "2022-01-01", date_to: "2080-12-31" },
    ],
  },
  {
    research_code: "RES003",
    research_year: 2022,
    title: "Water Resource Management in the Kagera River System",
    description: "Analysis of discharge patterns and water availability for sustainable management",
    lead_researcher: "Dr. Emmanuel Lugomela",
    research_team: "Dr. Fatuma Hassan, Eng. Michael Mwanga, Dr. Rose Kimaro",
    submission_to: "Water Resources Management Journal",
    date_started: "2021-06-01",
    date_finished: "2022-08-15",
    date_created: "2021-06-01T14:00:00Z",
    created_by: "Dr. Emmanuel Lugomela",
    related_data: [
      { climate_scenario: "OBSERVED", data_type: "DISCHARGE", date_from: "1975-01-01", date_to: "2022-12-31" },
      { climate_scenario: "SSP370", data_type: "DISCHARGE", date_from: "2023-01-01", date_to: "2100-12-31" },
    ],
  },
  {
    research_code: "RES004",
    research_year: 2023,
    title: "Extreme Weather Events and Climate Variability in Tanzania",
    description: "Comprehensive study of extreme weather patterns and their socio-economic impacts",
    lead_researcher: "Prof. Daniel Olago",
    research_team: "Dr. Neema Mduma, Dr. Frank Kimambo, Ms. Joyce Lyimo",
    submission_to: "International Climate Change Journal",
    date_started: "2022-01-10",
    date_finished: "2023-09-30",
    date_created: "2022-01-10T11:00:00Z",
    created_by: "Prof. Daniel Olago",
    related_data: [
      { climate_scenario: "OBSERVED", data_type: "RAINFALL", date_from: "1970-01-01", date_to: "2023-12-31" },
      { climate_scenario: "OBSERVED", data_type: "TEMPERATURE", date_from: "1973-01-01", date_to: "2023-12-31" },
      { climate_scenario: "SSP585", data_type: "RAINFALL", date_from: "2024-01-01", date_to: "2100-12-31" },
    ],
  },
  {
    research_code: "RES005",
    research_year: 2024,
    title: "Future Climate Scenarios and Adaptation Strategies for Kagera Basin",
    description: "Modeling future climate conditions and developing adaptation strategies for local communities",
    lead_researcher: "Dr. Amina Mwalimu",
    research_team: "Dr. Hassan Mwandambo, Prof. Catherine Sanga, Dr. Joseph Mbwambo",
    submission_to: "Climate Adaptation and Resilience Journal",
    date_started: "2023-02-15",
    date_finished: "2024-10-20",
    date_created: "2023-02-15T08:00:00Z",
    created_by: "Dr. Amina Mwalimu",
    related_data: [
      { climate_scenario: "SSP126", data_type: "RAINFALL", date_from: "2025-01-01", date_to: "2100-12-31" },
      { climate_scenario: "SSP245", data_type: "TEMPERATURE", date_from: "2025-01-01", date_to: "2100-12-31" },
      { climate_scenario: "SSP370", data_type: "DISCHARGE", date_from: "2025-01-01", date_to: "2100-12-31" },
    ],
  },
]

const columns = [
  { key: "research_code", label: "Code", sortable: true },
  { key: "research_year", label: "Year", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "lead_researcher", label: "Lead Researcher", sortable: true },
  { key: "submission_to", label: "Submitted To", sortable: true },
  { key: "date_started", label: "Start Date", sortable: true },
  { key: "date_finished", label: "End Date", sortable: true },
]

const filters = [
  {
    key: "research_year",
    label: "Research Year",
    options: ["2020", "2021", "2022", "2023", "2024"],
  },
  {
    key: "lead_researcher",
    label: "Lead Researcher",
    options: [
      "Dr. John Mwandosya",
      "Prof. Grace Mbwambo",
      "Dr. Emmanuel Lugomela",
      "Prof. Daniel Olago",
      "Dr. Amina Mwalimu",
    ],
  },
  {
    key: "submission_to",
    label: "Submitted To",
    options: [
      "Tanzania Journal of Climate Science",
      "African Agricultural Research Journal",
      "Water Resources Management Journal",
      "International Climate Change Journal",
      "Climate Adaptation and Resilience Journal",
    ],
  },
]

export function ResearchDocuments() {
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const toggleRowExpansion = (researchCode: string) => {
    setExpandedRows((prev) =>
      prev.includes(researchCode) ? prev.filter((code) => code !== researchCode) : [...prev, researchCode],
    )
  }

  const handleAdd = () => {
    console.log("Add new research document")
  }

  const handleEdit = (item: any) => {
    console.log("Edit research document:", item)
  }

  const handleDelete = (item: any) => {
    console.log("Delete research document:", item)
  }

  const handleExport = (format: string) => {
    console.log("Export research documents as:", format)
  }

  // Custom table component with expandable rows
  const CustomTable = () => (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expand</th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {researchDocumentsData.map((item) => (
            <>
              <tr key={item.research_code} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => toggleRowExpansion(item.research_code)}>
                    {expandedRows.includes(item.research_code) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.key === "title" ? (
                      <div className="max-w-xs truncate" title={item[column.key as keyof typeof item] as string}>
                        {item[column.key as keyof typeof item] as string}
                      </div>
                    ) : (
                      String(item[column.key as keyof typeof item] || "")
                    )}
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
              {expandedRows.includes(item.research_code) && (
                <tr className="bg-gray-50">
                  <td colSpan={columns.length + 2} className="px-4 py-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Description:</h4>
                      <p className="text-sm text-gray-700">{item.description}</p>
                      <h4 className="font-medium text-gray-900">Research Team:</h4>
                      <p className="text-sm text-gray-700">{item.research_team}</p>
                      <h4 className="font-medium text-gray-900">Related Data:</h4>
                      <div className="space-y-2">
                        {item.related_data.map((data, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-white p-2 rounded border">
                            <span className="font-medium">Climate Scenario:</span> {data.climate_scenario} |
                            <span className="font-medium"> Data Type:</span> {data.data_type} |
                            <span className="font-medium"> Period:</span> {data.date_from} to {data.date_to}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Research Documents</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAdd}>Add New Document</Button>
        </div>
      </div>

      <CustomTable />

      <div className="text-sm text-gray-500">Showing {researchDocumentsData.length} research documents</div>
    </div>
  )
}
