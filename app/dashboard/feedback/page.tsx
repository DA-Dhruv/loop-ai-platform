"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/ui/DataTable";
import { supabase } from "../../../lib/supabase";

type Feedback = {
  id: number;
  customer: string;
  rating: number;
  status: string;
  date: string;
};

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);

  const [customer, setCustomer] = useState("");
  const [rating, setRating] = useState(0);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*");

      if (error) {
        console.error("Error fetching feedback:", error.message);
        return;
      }

      if (data) {
        setFeedbackData(
          data.map((feedback) => ({
            id: feedback.id,
            customer: feedback.customer,
            rating: feedback.rating,
            status: feedback.status,
            date: feedback.date,
          }))
        );
      }
    };

    fetchFeedback();
  }, []);

  const rows = feedbackData.map((feedback) => [
    feedback.customer,
    "★".repeat(feedback.rating),
    feedback.status,
    feedback.date,
    "Delete",
  ]);

  const handleAddFeedback = async () => {
    if (!customer || rating === 0) {
      alert("Please enter customer name and select a rating.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5 stars.");
      return;
    }

    let calculatedStatus = "Neutral";

    if (rating <= 2) {
      calculatedStatus = "Negative";
    } else if (rating >= 4) {
      calculatedStatus = "Positive";
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert([
        {
          customer,
          rating,
          status: calculatedStatus,
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
      console.error("Error adding feedback:", error.message);
      return;
    }

    if (data) {
      setFeedbackData([
        ...feedbackData,
        {
          id: data.id,
          customer: data.customer,
          rating: data.rating,
          status: data.status,
          date: data.date,
        },
      ]);
    }

    setCustomer("");
    setRating(0);
  };

  const handleDelete = async (index: number) => {
    const feedback = feedbackData[index];

    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", feedback.id);

    if (error) {
      console.error("Error deleting feedback:", error.message);
      return;
    }

    setFeedbackData(
      feedbackData.filter((_, i) => i !== index)
    );
  };

  const handleEdit = (index: number) => {
    const feedback = feedbackData[index];

    setEditIndex(index);
    setEditCustomer(feedback.customer);
    setEditRating(feedback.rating);
  };

  const handleUpdate = async () => {
    if (editIndex === null) return;

    if (!editCustomer || editRating === 0) {
      alert("Please enter customer name and select a rating.");
      return;
    }

    if (editRating < 1 || editRating > 5) {
      alert("Rating must be between 1 and 5 stars.");
      return;
    }

    const feedback = feedbackData[editIndex];

    let calculatedStatus = "Neutral";

    if (editRating <= 2) {
      calculatedStatus = "Negative";
    } else if (editRating >= 4) {
      calculatedStatus = "Positive";
    }

    const { data, error } = await supabase
      .from("feedback")
      .update({
        customer: editCustomer,
        rating: editRating,
        status: calculatedStatus,
      })
      .eq("id", feedback.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating feedback:", error.message);
      return;
    }

    if (data) {
      const updatedData = [...feedbackData];

      updatedData[editIndex] = {
        id: data.id,
        customer: data.customer,
        rating: data.rating,
        status: data.status,
        date: data.date,
      };

      setFeedbackData(updatedData);
    }

    setEditIndex(null);
    setEditCustomer("");
    setEditRating(0);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditCustomer("");
    setEditRating(0);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-8">
        Feedback
      </h1>

      {/* Edit Feedback - Hidden until Edit is clicked */}
      {editIndex !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            Edit Feedback
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={editCustomer}
              onChange={(e) => setEditCustomer(e.target.value)}
              placeholder="Customer name"
              className="border rounded-lg p-3"
            />

            <div className="border rounded-lg p-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEditRating(index + 1)}
                  className={`text-3xl cursor-pointer ${
                    index < editRating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Update Feedback
            </button>

            <button
              onClick={handleCancelEdit}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Feedback */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">
          Add Feedback
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="border rounded-lg p-3"
          />

          <div className="border rounded-lg p-3 flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                className={`text-3xl cursor-pointer ${
                  index < rating
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
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
        >
          Add Feedback
        </button>
      </div>

      {/* Feedback Table */}
      <DataTable
        headers={["Customer", "Rating", "Status", "Date", "Action"]}
        rows={rows}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
}