import { upsertUser } from "../services/firestoreService.js";

export async function createUser(req, res, next) {
  try {
    const { name, mobileNumber } = req.body;

    if (!name?.trim() || !mobileNumber?.trim()) {
      const err = new Error("Name and mobile number are required");
      err.status = 400;
      throw err;
    }

    const mobileRegex = /^[0-9+\-\s]{7,15}$/;
    if (!mobileRegex.test(mobileNumber.trim())) {
      const err = new Error("Please enter a valid mobile number");
      err.status = 400;
      throw err;
    }

    const user = await upsertUser({
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
