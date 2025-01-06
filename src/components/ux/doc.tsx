import { badgeItems } from "@/constants/aside"
import { Avatar } from "@nextui-org/react"
import { Badge } from "@nextui-org/react"
import { Button } from "@nextui-org/react"
import { GitPullRequest, MessageSquare } from "lucide-react"
import { BadgeText } from "../ui/item"

export default function SimplifiedDocEditor() {

    return (
        <div className="h-full flex flex-col gap-4">
            <header className="flex flex-col gap-1">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-2 flex items-center">
                            <GitPullRequest className="mr-2 h-6 w-6 text-green-500" />
                            Implementar autenticación de usuarios
                        </h1>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>#42</span>
                            <span>opened 3 days ago by</span>
                            <Avatar className="h-5 w-5">
                                <img src="/placeholder-user.jpg" alt="@username" />
                                <span>UN</span>
                            </Avatar>
                            <span>username</span>
                        </div>
                    </div>
                    <Button variant="faded">Edit</Button>
                </div>
            </header>
            <section>
                <div className="flex list-none">
                    {badgeItems.map((item, index) => (
                        <BadgeText
                            key={index}
                            text={item.text}
                            color={item.color}
                        />
                    ))}
                </div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="mb-4">
                    Implement user authentication system using JWT tokens. This includes login, registration, and
                    password reset functionalities.
                </p>
                <h2 className="text-lg font-semibold mb-2">Acceptance Criteria</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>Users can register with email and password</li>
                    <li>Users can log in with their credentials</li>
                    <li>Users can reset their password via email</li>
                    <li>JWT tokens are securely stored and transmitted</li>
                </ul>
                <div className="flex space-x-4 mb-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-1">Assignees</h3>
                        <div className="flex -space-x-2">
                            <Avatar className="border-2 border-background">
                                <img src="/placeholder-user.jpg" alt="@user1" />
                                <span>U1</span>
                            </Avatar>
                            <Avatar className="border-2 border-background">
                                <img src="/placeholder-user.jpg" alt="@user2" />
                                <span>U2</span>
                            </Avatar>
                        </div>
                    </div>
                    <div className="flex-1 items-center gap-2">
                        <h3 className="text-sm">Story Points</h3>
                        <BadgeText
                            text={'9'}
                            color={'indigo'}
                        />
                    </div>
                </div>
            </section>
            <footer className="flex flex-col items-start pt-6 border-t-1 border-t-slate-300">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments
                </h2>
                <div className="w-full space-y-2">
                    <div className="flex items-start space-x-2">
                        <Avatar>
                            <img src="/placeholder-user.jpg" alt="@user2" />
                            <span>U2</span>
                        </Avatar>
                        <div className="flex-1 bg-gray-100 rounded-lg">
                            <div className="p-2">
                                <div className="font-semibold mb-1">user2</div>
                                <p>Great progress! I've started working on the password reset feature.</p>
                            </div>
                            <div className="text-sm text-muted-foreground p-2">1 day ago</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Avatar>
                            <img src="/placeholder-user.jpg" alt="@user2" />
                            <span>U2</span>
                        </Avatar>
                        <div className="flex-1 bg-gray-100 rounded-lg">
                            <div className="p-2">
                                <div className="font-semibold mb-1">user2</div>
                                <p>Great progress! I've started working on the password reset feature.</p>
                            </div>
                            <div className="text-sm text-muted-foreground p-2">1 day ago</div>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-4">
                    <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Leave a comment"
                        rows={3}
                    ></textarea>
                    <Button className="mt-2">Comment</Button>
                </div>
            </footer>
        </div>
    )
}
