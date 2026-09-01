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

export default function DemoPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const [customer, setCustomer] = useState("");
  const [rating, setRating] = useState(0);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editRating, setEditRating] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchDemoData = async () => {
    const { data: feedbackData, error: feedbackError } =
      await supabase
        .from("demo_feedback")
        .select("*")
        .order("id", { ascending: false });

    const { data: reportsData, error: reportsError } =
      await supabase
        .from("demo_reports")
        .select("*")
        .order("id", { ascending: false });

    if (feedbackError) {
      console.error(
        "Error fetching demo feedback:",
        feedbackError.message
      );
    }

    if (reportsError) {
      console.error(
        "Error fetching demo reports:",
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

  useEffect(() => {
    fetchDemoData();
  }, []);

  const getStatus = (value: number) => {
    if (value <= 2) return "Negative";
    if (value >= 4) return "Positive";
    return "Neutral";
  };

  const handleAddFeedback = async () => {
    if (!customer || rating === 0) {
      alert("Please enter a customer name and select a rating.");
      return;
    }

    const status = getStatus(rating);

    const { data, error } = await supabase
      .from("demo_feedback")
      .insert([
        {
          customer,
          rating,
          status,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Error adding demo feedback:",
        error.message
      );
      alert("Unable to add feedback.");
      return;
    }

    if (data) {
      setFeedback([data, ...feedback]);
    }

    setCustomer("");
    setRating(0);
  };

  const handleDeleteFeedback = async (id: number) => {
    const { error } = await supabase
      .from("demo_feedback")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting demo feedback:",
        error.message
      );
      return;
    }

    setFeedback(
      feedback.filter((item) => item.id !== id)
    );
  };

  const startEdit = (item: Feedback) => {
    setEditingId(item.id);
    setEditCustomer(item.customer);
    setEditRating(item.rating);
  };

  const handleUpdateFeedback = async () => {
    if (editingId === null || !editCustomer || editRating === 0) {
      alert("Please enter a customer name and select a rating.");
      return;
    }

    const status = getStatus(editRating);

    const { data, error } = await supabase
      .from("demo_feedback")
      .update({
        customer: editCustomer,
        rating: editRating,
        status,
      })
      .eq("id", editingId)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating demo feedback:",
        error.message
      );
      alert("Unable to update feedback.");
      return;
    }

    if (data) {
      setFeedback(
        feedback.map((item) =>
          item.id === editingId ? data : item
        )
      );
    }

    setEditingId(null);
    setEditCustomer("");
    setEditRating(0);
  };

  const handleGenerateReport = async () => {
    const { data, error } = await supabase
      .from("demo_reports")
      .insert([
        {
          title: "Demo Feedback Report",
          generated_on: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Error generating demo report:",
        error.message
      );
      alert("Unable to generate report.");
      return;
    }

    if (data) {
      setReports([data, ...reports]);
    }
  };

  const handleDeleteReport = async (id: number) => {
    const { error } = await supabase
      .from("demo_reports")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting demo report:",
        error.message
      );
      return;
    }

    setReports(
      reports.filter((report) => report.id !== id)
    );
  };

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
        <p className="text-gray-600">Loading demo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-blue-700 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              LOOP AI
            </h1>

            <p className="text-blue-100 mt-1">
              Public Demo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Sign In
            </Link>

            <span className="text-sm bg-blue-600 px-4 py-2 rounded-lg">
              Demo Mode
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Try Loop AI
          </h2>

          <p className="text-gray-600">
            This is a public demonstration using separate demo
            data. You can add, edit, and delete feedback and
            generate reports without creating an account.
          </p>
        </div>

        {/* Dashboard Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Add Feedback */}

        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">
            Add Demo Feedback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              className="border rounded-lg p-3"
            />

            <div className="border rounded-lg p-3 flex items-center gap-2">
              <span className="text-gray-600 mr-2">
                Rating:
              </span>

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl cursor-pointer ${
                    star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddFeedback}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Add Feedback
          </button>
        </section>

        {/* Feedback Table */}

        <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold">
              Demo Feedback
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-left">
                    Rating
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                  <th className="p-4 text-left">
                    Action
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

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteFeedback(item.id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {feedback.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No demo feedback available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Feedback */}

        {editingId !== null && (
          <section className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-5">
              Edit Demo Feedback
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={editCustomer}
                onChange={(e) =>
                  setEditCustomer(e.target.value)
                }
                placeholder="Customer name"
                className="border rounded-lg p-3"
              />

              <div className="border rounded-lg p-3 flex items-center gap-2">
                <span className="text-gray-600 mr-2">
                  Rating:
                </span>

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className={`text-2xl cursor-pointer ${
                      star <= editRating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpdateFeedback}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Update Feedback
            </button>
          </section>
        )}

        {/* Reports */}

        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold">
              Demo Reports
            </h2>

            <button
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Generate Report
            </button>
          </div>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {report.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Generated on {report.generated_on}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDeleteReport(report.id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}

            {reports.length === 0 && (
              <p className="text-gray-500">
                No demo reports available.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}