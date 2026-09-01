"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Feedback = {
  id: number;
  customer: string;
  rating: number;
  status: string;
  date: string;
};

type Report = {
  id: number;
  title: string;
  generated_on: string;
};

export default function ReviewDataPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: feedbackData, error: feedbackError } =
        await supabase
          .from("feedback")
          .select("*")
          .order("id", { ascending: false });

      const { data: reportsData, error: reportsError } =
        await supabase
          .from("reports")
          .select("*")
          .order("id", { ascending: false });

      if (feedbackError) {
        console.error(
          "Error fetching feedback:",
          feedbackError.message
        );
      }

      if (reportsError) {
        console.error(
          "Error fetching reports:",
          reportsError.message
        );
      }

      if (feedbackData) {
        setFeedback(feedbackData);
      }

      if (reportsData) {
        setReports(reportsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const totalFeedback = feedback.length;

  const positive = feedback.filter(
    (item) => item.status === "Positive"
  ).length;

  const negative = feedback.filter(
    (item) => item.status === "Negative"
  ).length;

  const neutral = feedback.filter(
    (item) => item.status === "Neutral"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading Loop AI...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">

      {/* Header */}

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              LOOP AI
            </h1>

            <p className="text-sm text-gray-500">
              Review Data
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="text-sm bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
              Read Only
            </span>

            <Link
              href="/demo"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Demo
            </Link>

            <Link
              href="/login"
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Sign In
            </Link>

          </div>
        </div>
      </header>

      {/* Main Content */}

      <main className="max-w-7xl mx-auto p-6">

        {/* Page Heading */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold">
            Review Data
          </h2>

          <p className="text-gray-600 mt-1">
            Overview of the Loop AI platform
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">
              Total Feedback
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {totalFeedback}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">
              Positive Reviews
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {positive}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">
              Negative Reviews
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {negative}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">
              Neutral Reviews
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">
              {neutral}
            </p>
          </div>

        </div>

        {/* Feedback */}

        <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">

          <div className="p-6 border-b">

            <h3 className="text-xl font-bold">
              Recent Feedback
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Latest customer feedback
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b">

                <tr>

                  <th className="p-4 text-left font-semibold">
                    Customer
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Rating
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Status
                  </th>

                  <th className="p-4 text-left font-semibold">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {feedback.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {item.customer}
                    </td>

                    <td className="p-4">
                      <span className="text-yellow-500 text-lg">
                        {"★".repeat(item.rating)}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.status}
                    </td>

                    <td className="p-4">
                      {item.date}
                    </td>

                  </tr>

                ))}

                {feedback.length === 0 && (

                  <tr>

                    <td
                      colSpan={4}
                      className="p-6 text-center text-gray-500"
                    >
                      No feedback available.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* Reports */}

        <section className="bg-white rounded-xl shadow-md p-6">

          <div className="mb-5">

            <h3 className="text-xl font-bold">
              Reports
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Available reports
            </p>

          </div>

          <div className="space-y-3">

            {reports.map((report) => (

              <div
                key={report.id}
                className="border rounded-lg p-4"
              >

                <p className="font-semibold">
                  {report.title}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Generated on {report.generated_on}
                </p>

              </div>

            ))}

            {reports.length === 0 && (

              <p className="text-gray-500">
                No reports available.
              </p>

            )}

          </div>

        </section>

        {/* Bottom Information */}

        <div className="mt-8 text-center">

          <p className="text-sm text-gray-500 mb-4">
            This page is read-only. To interact with the platform,
            use the interactive demo.
          </p>

          <Link
            href="/demo"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Try Interactive Demo
          </Link>

        </div>

      </main>

    </div>
  );
}