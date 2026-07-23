import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function POST(request) {
    try {
        await connectDB()

        // 1. Check if any admin already exists in the system
        const adminCount = await UserModel.countDocuments({ role: 'admin', deletedAt: null })
        if (adminCount > 0) {
            return response(false, 403, 'An admin account already exists. First-time registration is disabled.')
        }

        // 2. Parse and validate request body
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input fields.', validatedData.error.flatten().fieldErrors)
        }

        const { name, email, password } = validatedData.data

        // 3. Check if email already in use (by any active user)
        const existingUser = await UserModel.findOne({ email, deletedAt: null })
        if (existingUser) {
            return response(false, 400, 'Email is already registered.')
        }

        // 4. Create the new admin account (auto-verify email for first-time set up)
        const newAdmin = new UserModel({
            name,
            email,
            password,
            role: 'admin',
            isEmailVerified: true
        })

        await newAdmin.save()

        return response(true, 201, 'Admin account successfully registered. You can now log in.')
    } catch (error) {
        return catchError(error)
    }
}
