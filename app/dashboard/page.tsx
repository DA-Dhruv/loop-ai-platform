"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [totalFeedback, setTotalFeedback] = useState(0);
  const [positiveReviews, setPositiveReviews] = useState(0);
  const [neutralReviews, setNeutralReviews] = useState(0);
  const [negativeReviews, setNegativeReviews] = useState(0);

  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch feedback for dashboard cards
      const { data, error } = await supabase
        .from("feedback")
        .select("status");

      if (error) {
        console.error(
          "Error fetching dashboard data:",
          error.message
        );
        return;
      }

      if (data) {
        setTotalFeedback(data.length);

        setPositiveReviews(
          data.filter(
            (feedback) => feedback.status === "Positive"
          ).length
        );

        setNeutralReviews(
          data.filter(
            (feedback) => feedback.status === "Neutral"
          ).length
        );

        setNegativeReviews(
          data.filter(
            (feedback) => feedback.status === "Negative"
          ).length
        );
      }

      // Fetch recent feedback activity
      const {
        data: feedbackData,
        error: feedbackError,
      } = await supabase
        .from("feedback")
        .select("customer, rating, date")
        .order("id", { ascending: false })
        .limit(3);

      // Fetch recent reports activity
      const {
        data: reportsData,
        error: reportsError,
      } = await supabase
        .from("reports")
        .select("title, generated_on")
        .order("id", { ascending: false })
        .limit(3);

      if (feedbackError) {
        console.error(
          "Error fetching feedback activity:",
          feedbackError.message
        );
      }

      if (reportsError) {
        console.error(
          "Error fetching report activity:",
          reportsError.message
        );
      }

      const activities: string[] = [];

      feedbackData?.forEach((feedback) => {
        activities.push(
          `${feedback.customer} submitted ${feedback.rating}-star feedback`
        );
      });

      reportsData?.forEach((report) => {
        activities.push(
          `Report generated: ${report.title}`
        );
      });

      setRecentActivities(activities.slice(0, 5));
    };

    fetchDashboardData();
  }, []);

  const dashboardData = [
    {
      title: "Total Feedback",
      value: totalFeedback,
      description: "All customer feedback",
      color: "blue",
    },
    {
      title: "Positive Reviews",
      value: positiveReviews,
      description: "Satisfied customers",
      color: "green",
    },
    {
      title: "Neutral Reviews",
      value: neutralReviews,
      description: "Neutral customer feedback",
      color: "yellow",
    },
    {
      title: "Negative Reviews",
      value: negativeReviews,
      description: "Reviews requiring attention",
      color: "red",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            Loop AI Platform
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor customer feedback and review activity.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/feedback")}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          Add Feedback
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {dashboardData.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                {card.title}
              </p>

              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  card.color === "blue"
                    ? "bg-blue-600"
                    : card.color === "green"
                    ? "bg-green-600"
                    : card.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
              />
            </div>

            <p
              className={`text-4xl font-bold mt-4 ${
                card.color === "blue"
                  ? "text-blue-600"
                  : card.color === "green"
                  ? "text-green-600"
                  : card.color === "yellow"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {card.value}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest feedback and report activity
          </p>
        </div>

        {recentActivities.length > 0 ? (
          <div>
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />

                  <p className="text-gray-700">
                    {activity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500">
              No recent activity found.
            </p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mt-8 mb-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Access the main features of Loop AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Feedback */}
          <button
            onClick={() => router.push("/dashboard/feedback")}
            className="group bg-white rounded-xl p-6 text-left border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <div className="w-4 h-4 border-2 border-blue-600 rounded-sm" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Add Feedback
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add new customer feedback and track sentiment.
            </p>

            <div className="mt-5 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition">
              Open Feedback →
            </div>
          </button>

          {/* Reports */}
          <button
            onClick={() => router.push("/dashboard/reports")}
            className="group bg-white rounded-xl p-6 text-left border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center mb-5">
              <div className="w-5 h-5 border-2 border-green-600 rounded-sm" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              View Reports
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Generate and manage customer feedback reports.
            </p>

            <div className="mt-5 text-green-600 text-sm font-semibold group-hover:translate-x-1 transition">
              Open Reports →
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="group bg-white rounded-xl p-6 text-left border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center mb-5">
              <div className="w-5 h-3 border-2 border-purple-600 rounded-full" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Settings
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Manage your Loop AI dashboard settings.
            </p>

            <div className="mt-5 text-purple-600 text-sm font-semibold group-hover:translate-x-1 transition">
              Open Settings →
            </div>
          </button>

        </div>
      </section>

    </div>
  );
}