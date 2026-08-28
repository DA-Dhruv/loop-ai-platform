"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import { supabase } from "../../../lib/supabase";

type Report = {
  id: number;
  title: string;
  generatedOn: string;
  status: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTitle, setReportTitle] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error.message);
        return;
      }

      if (data) {
        setReports(
          data.map((report) => ({
            id: report.id,
            title: report.title,
            generatedOn: report.generated_on,
            status: report.status,
          }))
        );
      }
    };

    fetchReports();
  }, []);

  const rows = reports.map((report) => [
    report.title,
    report.generatedOn,
    report.status,
    "Delete",
  ]);

  const handleGenerateReport = async () => {
    if (!reportTitle.trim()) {
      alert("Please enter a report name.");
      return;
    }

    const generatedOn = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          title: reportTitle.trim(),
          generated_on: generatedOn,
          status: "Completed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error generating report:", error.message);
      alert("Unable to generate report.");
      return;
    }

    if (data) {
      setReports((currentReports) => [
        ...currentReports,
        {
          id: data.id,
          title: data.title,
          generatedOn: data.generated_on,
          status: data.status,
        },
      ]);
    }

    setReportTitle("");
  };

  const handleDelete = async (index: number) => {
    const report = reports[index];

    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", report.id);

    if (error) {
      console.error("Error deleting report:", error.message);
      alert("Unable to delete report.");
      return;
    }

    setReports((currentReports) =>
      currentReports.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-8">
        Reports
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-black mb-4">
          Generate Report
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Report name"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="border rounded-lg p-3 flex-1 text-black"
          />

          <button
            onClick={handleGenerateReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>

      {reports.length > 0 ? (
        <DataTable
          headers={["Report", "Generated On", "Status", "Actions"]}
          rows={rows}
          onDelete={handleDelete}
        />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold text-black">
            No Reports Found
          </h2>

          <p className="mt-2 text-gray-600">
            Generate your first report using the form above.
          </p>
        </div>
      )}
    </>
  );
}