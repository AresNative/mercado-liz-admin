"use client";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Progress,
  Divider,
  Textarea,
} from "@nextui-org/react";
import { GitPullRequest, MessageSquare } from "lucide-react";

export default function Component() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex sm:flex-row items-start min-w-full justify-between">
            <div>
              <h1 className="text-2xl sm:text-1xl font-bold mb-2 flex items-center">
                <GitPullRequest
                  className="mr-2 h-6 w-6 text-green-500"
                  size={40}
                  absoluteStrokeWidth
                />
                Implementar autenticación de usuarios
              </h1>
              <div className=" min-w-full flex items-center space-x-3 text-sm text-gray-500">
                <span>#42</span>
                <span>opened 3 days ago by</span>
                <Avatar
                  src="/placeholder-user.jpg"
                  size="sm"
                  className="mr-1"
                />
                <span>username</span>
              </div>
            </div>
            <Button color="primary" variant="ghost" className="ml-auto">
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex items-center space-x-2 mb-4 ml-10 gap-16">
            <Badge content="In Progress" color="primary" variant="flat" />

            <Badge content="Backend" color="secondary" variant="flat" />

            <Badge content="Sprint 3" color="default" variant="bordered" />
          </div>
          <Progress value={60} color="primary" className="mb-4" />
          <p className="text-sm text-gray-500 mb-4">60% complete</p>

          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="mb-4">
            Implement user authentication system using JWT tokens. This includes
            login, registration, and password reset functionalities.
          </p>

          <h2 className="text-lg font-semibold mb-2">Acceptance Criteria</h2>
          <ul className="list-disc list-inside mb-4 ml-4">
            <li>Users can register with email and password</li>
            <li>Users can log in with their credentials</li>
            <li>Users can reset their password via email</li>
            <li>JWT tokens are securely stored and transmitted</li>
          </ul>

          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Assignees</h3>
              <div className="flex -space-x-2">
                <Avatar
                  src="/placeholder-user.jpg"
                  size="sm"
                  className="border-2 border-background"
                />
                <Avatar
                  src="/placeholder-user.jpg"
                  size="sm"
                  className="border-2 border-background"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Story Points</h3>
              <Badge color="default" variant="bordered">
                8
              </Badge>
            </div>
          </div>
        </CardBody>

        <Divider />

        <CardFooter className="flex flex-col items-start pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Comments
          </h2>

          <div className="w-full space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar src="/placeholder-user.jpg" size="sm" />
              <div className="flex-1">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="font-semibold mb-1">user1</div>
                  <p>
                    Login functionality is complete. Moving on to registration.
                  </p>
                </div>
                <div className="text-sm text-gray-500 mt-2">2 days ago</div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Avatar src="/placeholder-user.jpg" size="sm" />
              <div className="flex-1">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="font-semibold mb-1">user2</div>
                  <p>test</p>
                </div>
                <div className="text-sm text-gray-500 mt-2">1 day ago</div>
              </div>
            </div>
          </div>

          <div className="w-full mt-4">
            <Textarea placeholder="Leave a comment" rows={3} className="mb-2" />
            <Button color="primary" auto>
              Comment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
