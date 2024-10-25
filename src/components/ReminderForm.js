import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export default function ReminderForm({ onAddReminder, onCancel, categories }) {
  const [reminder, setReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "",
    isRecurring: false,
    recurringDay: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReminder((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReminder(reminder);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={reminder.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={reminder.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={reminder.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          name="time"
          type="time"
          value={reminder.time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          name="category"
          value={reminder.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRecurring"
          name="isRecurring"
          checked={reminder.isRecurring}
          onCheckedChange={(checked) =>
            setReminder((prev) => ({ ...prev, isRecurring: checked }))
          }
        />
        <Label htmlFor="isRecurring">Recurring</Label>
      </div>
      {reminder.isRecurring && (
        <div>
          <Label htmlFor="recurringDay">Recurring Day</Label>
          <Select
            id="recurringDay"
            name="recurringDay"
            value={reminder.recurringDay || ""}
            onChange={handleChange}
            required={reminder.isRecurring}
          >
            <option value="">Select a day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Reminder</Button>
      </div>
    </form>
  );
}
