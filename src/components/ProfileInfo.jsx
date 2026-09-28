function ProfileInfo({ label, value }) {
  return (
    <div className="profile-info-card">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default ProfileInfo;
