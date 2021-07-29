def parse_input():
    N, _, _ = map(int, input().split())
    responses = {}
    for _ in range(N):
        line = input()
        line_split = line.split()
        S = int(line_split[0])
        A = map(int, line_split[1:])
        responses[S] = A
    C = list(map(int, input().split()))
    return responses, C


def calculate_scores(responses, answers):
    scores = {}
    for student_id in responses:
        score = 0
        response = responses[student_id]
        for i, student_choice in enumerate(response):
            if answers[i] == student_choice:
                score += 1
        scores[student_id] = score
    return scores


def calculate_ranks(scores):
    last_given_rank = 0
    next_available_rank = 1
    known_min_score = -1
    descending_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    ranks = {}
    for student_id, score in descending_scores:
        if known_min_score != -1 and known_min_score == score:
            # same score as previous student
            rank = last_given_rank
        else:
            # lower score than previous students
            rank = next_available_rank
        ranks[student_id] = rank
        last_given_rank = rank
        next_available_rank += 1
        known_min_score = score
    return ranks


def print_output(scores, ranks):
    for key in sorted(scores.keys()):
        print(f"Student #{key}: {scores[key]} {ranks[key]}")


def main():
    responses, C = parse_input()
    scores = calculate_scores(responses, C)
    ranks = calculate_ranks(scores)
    print_output(scores, ranks)

main()