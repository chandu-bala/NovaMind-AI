const { db } = require("../config/firestore");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (!userSnap.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, userId: userRef.id });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (userSnap.empty) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const userDoc = userSnap.docs[0];
    const user = userDoc.data();

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        id: userDoc.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
