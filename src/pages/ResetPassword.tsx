import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the password meets the 7-character requirement
  const isPasswordValid = newPassword.length >= 7;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return; // Extra safety check

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Error updating password: " + error.message);
    } else {
      alert("Password updated successfully!");
      navigate("/login"); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F111A] text-white p-4">
      <div className="bg-[#1E212B] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full border bg-gray-700 p-2 rounded text-white focus:outline-none pr-10 ${
                  newPassword.length > 0 && !isPasswordValid 
                    ? 'border-red-500 focus:border-red-500' // Red border if typing but too short
                    : 'border-gray-600 focus:border-orange-500' // Normal/Orange border otherwise
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} 
              </button>
            </div>
            
            {/* Real-time length confirmation text */}
            <p className={`text-xs mt-2 transition-colors ${isPasswordValid ? 'text-green-500' : 'text-gray-400'}`}>
              {isPasswordValid ? '✓ Minimum 7 characters reached' : 'Must be at least 7 characters long'}
            </p>
            
          </div>
          <button 
            type="submit" 
            disabled={loading || !isPasswordValid}
            className={`w-full font-semibold py-2 rounded transition-colors mt-2 ${
              !isPasswordValid 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' // Grayed out button when invalid
                : 'bg-orange-500 hover:bg-orange-600 text-white' // Orange when ready
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
