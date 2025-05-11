import sys, json, struct, os, subprocess

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    response = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(response)))
    sys.stdout.buffer.write(response)
    sys.stdout.buffer.flush()

if __name__ == '__main__':
    try:
        data = read_message()
        url = data["url"]
        referer = data["referer"]
        user_agent = data["userAgent"]
        filename = data["filename"]

        download_path = os.path.join(os.path.expanduser("~"), "Downloads", filename)

        downloader_path = os.path.abspath("downloader.py")
        subprocess.Popen([
            "cmd.exe", "/C", "start", "cmd.exe", "/K",
            "python", downloader_path, url, referer, user_agent, download_path
        ])

        send_message({ "status": "ok", "file": download_path, "launched": True })

    except Exception as e:
        send_message({ "status": "error", "message": str(e) })
