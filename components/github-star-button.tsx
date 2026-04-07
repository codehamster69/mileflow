type GitHubStarButtonProps = {
  className?: string;
};

export function GitHubStarButton({ className }: GitHubStarButtonProps) {
  return (
    <iframe
      src="https://ghbtns.com/github-btn.html?user=codehamster69&repo=mileflow-xe&type=star&count=true&size=large"
      title="Star codehamster69/mileflow-xe on GitHub"
      width="220"
      height="30"
      style={{ border: 0, overflow: 'hidden' }}
      scrolling="no"
      className={className}
    />
  );
}
