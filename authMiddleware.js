import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// Middleware to check if the user is authenticated with Supabase
const authMiddleware = async (req, res, next) => {
  const supabase = createServerComponentClient({ cookies: req.headers.cookie });

  const { user } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to a login page or perform another action for unauthenticated users
    return res.redirect('/login'); // Replace with your desired route
  }

  // Attach the user object to the request for use in the route handler
  req.user = user;

  // Continue to the next middleware or route handler
  next();
};

export default authMiddleware;