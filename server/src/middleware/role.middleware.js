export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

// Block actions until specific stage reached
export const requireWorkerStageAtLeast = (minStage) => async (req, res, next) => {
  // simple order map
  const order = ["TNC_PENDING","TNC_ACCEPTED","POLICE_DOC_SUBMITTED","UNDER_REVIEW","APPROVED","REJECTED"];
  const idx = (s) => order.indexOf(s);
  const profile = req.workerProfile; // set earlier in route
  if (!profile) return res.status(400).json({ message: "No worker profile" });
  if (idx(profile.verification.stage) < idx(minStage))
    return res.status(403).json({ message: `Stage ${minStage} required` });
  next();
};
