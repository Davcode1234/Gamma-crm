export const permit =
  (...allowed: string[]) =>
  (req, res, next) => {
    const roles: string[] = (req.user as any)?.roles || [];
    const ok = roles.some((r) => allowed.includes(r));
    if (!ok) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
