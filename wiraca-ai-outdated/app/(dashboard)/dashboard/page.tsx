'use client'

import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { Plus, Calendar, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-accent-deep">
            Dashboard
          </h1>
          <p className="text-gray-500">Welcome back to Wicara AI</p>
        </div>
        <Button color="primary" endContent={<Plus size={20} />} className="shadow-lg shadow-primary-500/30 font-semibold">
          New Recording
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4" shadow="sm">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
              <Calendar size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">Recent Meetings</p>
              <p className="text-small text-default-500">Your latest sessions</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-gray-500 py-4 text-center italic">No meetings yet</p>
            <Button variant="light" color="primary" className="w-full mt-2">
              View All History
            </Button>
          </CardBody>
        </Card>

        <Card className="p-4" shadow="sm">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-success-100 text-success-600">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">API Usage</p>
              <p className="text-small text-default-500">Real-time stats</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Status</span>
              <span className="text-success-600 font-medium bg-success-50 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Mode</span>
              <span className="text-primary-600 font-bold">BYOK</span>
            </div>
          </CardBody>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary-blue to-primary-slate text-white" shadow="md">
          <CardHeader>
            <p className="text-lg font-bold">Quick Start</p>
          </CardHeader>
          <CardBody>
            <p className="opacity-90 mb-4">
              Start recording your meeting immediately. We'll handle the transcription and analysis.
            </p>
            <Button
              className="bg-white text-primary-600 font-bold shadow-sm w-full"
              variant="solid"
              startContent={<Plus size={20} />}
            >
              Start Recording
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
