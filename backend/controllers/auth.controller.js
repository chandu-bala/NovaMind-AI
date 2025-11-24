const { db } = require("../config/firestore");
const bcrypt = require("bcrypt");

/* =============================
   SIGN UP
============================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return res.status(201).json({
      success: true,
      userId: newUserRef.id
    });

  } catch (error) {
    console.error("🔥 SIGNUP ERROR:", error.message);
    return res.status(500).json({ error: "Signup failed" });
  }
};


/* =============================
   LOGIN
============================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email
      }
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
};
