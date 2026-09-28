function ProfileStat({ label, value }) {
  const numericValue = Number(value) || 0;

  return (
    <div className="profile-stat">
      <div className="profile-stat-top">
        <span>{label}</span>

        <strong>{numericValue}</strong>
      </div>

      <div className="profile-stat-track">
        <div
          className="profile-stat-fill"
          style={{
            width: `${Math.min(
              Math.max(numericValue, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProfileStat;
