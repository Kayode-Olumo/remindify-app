import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ReminderDetail({ reminder, onBack }) {
  return (
    <Card className={`${reminder.color} w-full max-w-md mx-auto`}>
      <CardHeader>
        <CardTitle>{reminder.title}</CardTitle>
        <CardDescription>{reminder.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <strong>Date:</strong> {reminder.date}
        </p>
        <p className="mb-2">
          <strong>Time:</strong> {reminder.time}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {reminder.category}
        </p>
        {reminder.isRecurring && (
          <p className="mb-2">
            <strong>Recurring:</strong> Every {reminder.recurringDay}
          </p>
        )}
        <Button onClick={onBack} className="mt-4">
          Back to List
        </Button>
      </CardContent>
    </Card>
  );
}
